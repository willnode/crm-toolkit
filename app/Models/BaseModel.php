<?php namespace App\Models;

use CodeIgniter\Config\Services;
use CodeIgniter\Database\ConnectionInterface;
use CodeIgniter\Model;
use CodeIgniter\Validation\Exceptions\ValidationException;
use CodeIgniter\Validation\ValidationInterface;

class BaseModel extends Model
{
	// ----------------------------------------
	// GENERAL PROPS
	// ----------------------------------------
	/**
	 * Name of database table (REQUIRED)
	 * @var string
	 */
	protected $table;
	/**
	 * The table's primary key (REQUIRED)
	 * @var string
	 */
	protected $primaryKey;
	/**
	 * Callbacks for beforeExecute.
	 * (Useful for performing JOIN, using
	 * additional WHERE, performing early
	 * exits, etc).
	 * e => ['cursor', 'id', 'method', 'request']
	 * returns e, called every time before execution
	 * get called. If e contains response, then that
	 * execution process is stopped, returning
	 * that response instead.
	 */
	protected $beforeExecute = [];

	// ----------------------------------------
	// GET VERB PROPS
	// ----------------------------------------
	/**
	 * The SELECT query for GET.
	 * Note that IT IS recommended to
	 * specify white-list in array style
	 * so that we can perform ORDER BY
	 * in SAFE manner (minimizing risk
	 * of SQL injection)
	 * @var array|string
	 */
	protected $select = '*';
	/**
	 * Which columns can be partially searched
	 * @var string[]
	 */
	protected $searchable = [];
	/**
	 * Which columns can be filtered (exact match)
	 * @var string[]
	 */
	protected $indexable = [];
	/**
	 * Callbacks for afterFind.
	 * (Useful for subquering, etc).
	 * e => ['data', 'index']
	 * returns modified e
	 */
	protected $afterFind = [];
	/**
	 * Pagination size available options.
	 * If 'pageSize' is not in the list,
	 * or 'pageSize' is not specified,
	 * It will choose first in the list.
	 * Setting this to NULL will turn off
	 * pagination if 'pageSize' is not
	 * specified (NOT RECOMMENDED).
	 * @var int[]|null
	 */
	protected $enforcedPaginations = [100];

	// ----------------------------------------
	// POST VERB PROPS
	// ----------------------------------------
	/**
	 * An array of field names that are allowed
	 * to be set by the user in inserts/updates.
	 * @var string[]
	 */
	protected $allowedFields = [];
	/**
	 * Rules to set validate data uploads.
	 * @var array
	 */
	protected $fileUploadRules = [];
	/**
	 * Rules used to validate data in insert,
	 * update, and save methods. The array must
	 * match the format of data passed to the
	 * Validation library.
	 * File uploads should not belong here.
	 * @var array
	 */
	protected $validationRules = [];
	/**
	 * Contains any custom error messages to be
	 * used during data validation.
	 * @var array
	 */
	protected $validationMessages = [];

	// ----------------------------------------
	// POST VERB EVENTS
	// ----------------------------------------
	// The before/afterChange get called on
	// all Insert/Update/Delete events during execution
	// Before:
	// e => ['id', 'data', 'existing']
	// Note: ID === 0 and EXISTING === NULL during insert
	// Note: DATA === NULL during delete
	//
	// After:
	// e => ['id', 'data', 'method']
	// Note: method is CREATE/UPDATE/DELETE (constant)
	// Note: ID === INSERT_ID during insert
	// Note: DATA is the SET/VALUES after commit
	//       but in delete, DATA is NULL
	//       (If you want to clean stuff,
	//       consider to put them in beforeChange)
	protected $beforeChange = [];
	protected $afterChange = [];
	// These are builtins
	protected $beforeInsert = [];
	protected $afterInsert = [];
	protected $beforeUpdate = [];
	protected $afterUpdate = [];
	protected $beforeDelete = [];
	protected $afterDelete = [];

	public function __construct(ConnectionInterface &$db = null, ValidationInterface $validation = null)
	{
		parent::__construct($db, $validation);
		$this->beforeExecute[] = 'executeBeforeExecute';
		$this->beforeChange[] = 'executeBeforeChange';
		$this->afterChange[] = 'executeAfterChange';
		$this->beforeInsert[] = 'executeBeforeInsert';
		$this->afterInsert[] = 'executeAfterInsert';
		$this->beforeUpdate[] = 'executeBeforeUpdate';
		$this->afterUpdate[] = 'executeAfterUpdate';
		$this->beforeDelete[] = 'executeBeforeDelete';
		$this->afterDelete[] = 'executeAfterDelete';
		Services::request()->model = $this;
	}

	public function getMetadata()
	{
		$queryCan = ['canSearch' => count($this->searchable) > 0];
		$fields = [];
		array_walk($this->allowedFields, function(&$x,$v,$f) use (&$fields) {
			$fields[$x] = (array_search($x,$f) === FALSE) ? 'text' : 'file';
		}, array_keys($this->fileUploadRules));
		return (object)[
			'name' => static::class,
			'id' => $this->id ?? NULL,
			'query' => isset($this->query) ? array_merge($queryCan, $this->query) : NULL,
			'fields' => $fields,
			'method' => $this->method,
		];
	}

	protected function processGetQuery($query)
	{
		// Pagination
		$page = $query['page'] ?? NULL;
		$page = intval($page) ?: NULL;
		$pageSize = $query['pageSize'] ?? NULL;
		$pageSize = intval($pageSize) ?: NULL;
		if ($this->enforcedPaginations !== NULL
			AND !empty($this->enforcedPaginations))
		{
			if ($page !== NULL)
			{
				if (array_search($pageSize,
					$this->enforcedPaginations,
					TRUE) === NULL)
				{
					$pageSize = $this->enforcedPaginations[0];
				}
			} else {
				$pageSize = $this->enforcedPaginations[0];
				$page = 0;
			}
		} else if ($page !== NULL AND $pageSize === NULL) {
			// No pagination. Not safe.
			$page = NULL;
		}
		$result['page'] = $page;
		$result['pageSize'] = $pageSize;

		// Order By
		$orderBy = $query['orderBy'] ?? NULL;
		$orderBy = $orderBy ?: NULL;
		$orderDirection = $query['orderDirection'] ?? '';
		$orderDirection = $orderDirection === 'desc' ? 'desc' : 'asc';
		if ($orderBy)
		{
			if (is_array($this->select) AND
				array_search($orderBy, $this->select,
				TRUE) === NULL)
				$orderBy = NULL;
			else if ($orderDirection === NULL)
				$orderDirection = 'asc';
		}
		$result['orderBy'] = $orderBy;
		$result['orderDirection'] = $orderDirection;

		// Search
		if (empty($this->searchable)) {
			$search = NULL;
		} else {
			$search = $query['search'] ?? NULL;
			$search = $search ?: NULL;
		}
		$result['search'] = $search;

		// Filters
		if (!empty($this->indexable)) {
			$result['filters'] = array_intersect_key(
				$query,
				array_flip($this->indexable)
			);
		} else {
			$result['filters'] = NULL;
		}

		return $result;
	}


	/** @return CodeIgniter\HTTP\Response */
	public function execute($id = NULL) {
		helper('BackEnd');

		$cursor = $this->builder();
		$request = Services::request();
		$method = $request->getMethod();
		if (ENVIRONMENT === 'development') {
			// Workaround because debugger can't submit DELETE on HTML.
			// Turned off during production for good.
			if ($method === GET AND $request->getGet('delete')) {
				$method = DELETE;
			}
		}
		$event = $this->trigger('beforeExecute', [
			'builder' => $cursor,
			'id' => $id,
			'request' => $request,
			'method' => $method,
		]);
		$this->method = $method;
		$this->id = $id;
		if (isset($event['response'])) {
			return $event['response'];
		}
		if ($method === GET) {
			if ($id !== NULL) {
				// Specific Index
				if ($id === 0) {
					$data = get_default_values(
						$this->table, $this->primaryKey,
						$this->select);
				} else {
					$cursor->select($this->select);
					$data = $this->find($id);
				}
					if ($data !== NULL) {
					return load_ok([
						'data' => $data,
						'id' => $id,
					]);
				} else {
					return load_404();
				}
			}
			// These keys name has been matched with
			// Material-UI's table remote data query.
			// Notice: the page starts from zero
			$this->query = [
				'page' => $page,
				'pageSize' => $pageSize,
				'orderBy' => $orderBy,
				'orderDirection' => $orderDirection,
				'search' => $search,
				'filters' => $filters,
			] = $this->processGetQuery($request->getGet());

			$cursor->select($this->select);
			if ($page !== NULL) {
				$cursor->limit($pageSize);
				$cursor->offset($pageSize * $page);
			}
			if ($orderBy !== NULL) {
				$cursor->orderBy($orderBy, $orderDirection);
			}
			if ($search !== NULL) {
				$cursor->groupStart();
				foreach ($this->searchable as $col) {
					$cursor->orLike($col, $search);
				}
				$cursor->groupEnd();
			}
			if ($filters !== NULL) {
				$cursor->groupStart();
				foreach ($filters as $col => $val) {
					$cursor->where($col, $val);
				}
				$cursor->groupEnd();
			}

			$data = $this->find();
			return load_ok([
				'data' => $data
			]);
		} else if ($method === POST || $method === PUT) {
			try {
				if (!$id) {
					$result = $this->insert($request->getPost());
				} else {
					$result = $this->update($id, $request->getPost());
				}
			} catch (\Exception $th) {
				return load_error($th->getMessage());
			}
			if ($result) {
				return load_ok([
					'id' => $id ? $id : $result,
					'message' => $id ? 'Successfully updated' : 'Successfully created',
				]);
			} else {
				$errors = $this->validation->getErrors();
				return load_json([
					'message' => implode(', ', array_values($errors)),
					'validations' => $errors,
					'status' => 'Error'
				]);
			}
		} else if ($method === DELETE) {
			if ($id) {
				$result = $this->delete($id);
				if ($result) {
					return load_ok([
						'message' => 'Successfully deleted',
						'id' => $id,
					]);
				} else {
					return load_error('Failed');
				}
			}
		}
		return load_405();
	}

	protected function executeBeforeInsert($event) {
		foreach ($this->fileUploadRules as $name => $attr) {
			control_file_upload($event['data'], $name, $attr, NULL);
		}
		$event['data'] = $this->trigger('beforeChange', [
			'id'=> 0, 'data' => $event['data'], 'existing' => NULL
		])['data'];
		return $event;
	}

	protected function executeBeforeUpdate($event) {
		$id = $event['id'];
		if (!($existing = $this->find($id)))
			throw new ValidationException("Not Found");
		foreach ($this->fileUploadRules as $name => $attr) {
			control_file_upload($event['data'], $name, $attr, $existing);
		}
		$event['data'] = $this->trigger('beforeChange', [
			'id'=> $id, 'data' => $event['data'], 'existing' => $existing
		])['data'];
		return $event;
	}

	protected function executeBeforeDelete($event) {
		$id = $event['id'];
		if (!($existing = $this->find($id)))
			throw new ValidationException("Data Not Found");
		foreach ($this->fileUploadRules as $name => $attr) {
			if ($existing->{$name}) {
				control_file_delete($attr['folder'] ?? $name, $existing->{$name});
			}
		}
		$this->trigger('beforeChange', [
			'id'=> $id, 'data' => NULL, 'existing' => $existing
		]);
		return $event;
	}


	protected function executeBeforeExecute($event) {
		return $event;
	}
	protected function executeBeforeChange($event) {
		return $event;
	}
	protected function executeAfterChange($event) {
		return $event;
	}

	protected function executeAfterInsert($event) {
		$event['method'] = CREATE;
		$this->trigger('afterChange', $event);
		return $event;
	}

	protected function executeAfterUpdate($event) {
		$event['method'] = UPDATE;
		$this->trigger('afterChange', $event);
		return $event;
	}

	protected function executeAfterDelete($event) {
		$event['data'] = NULL;
		$event['method'] = DELETE;
		$this->trigger('afterChange', $event);
		return $event;
	}
}