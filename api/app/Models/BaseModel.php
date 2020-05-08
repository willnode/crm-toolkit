<?php

namespace App\Models;

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
	 * Which methods can be used for the model?
	 * @var string[]
	 */
	protected $only = NULL;

	/**
	 * Apply additional WHERE filter
	 */
	protected $where = NULL;
	/**
	 * Set columns that is need to be expanded up
	 * @var array
	 */
	protected $lookUp = [];
	/**
	 * Set columns that is need to be expanded down
	 * @var array
	 */
	protected $lookDown = [];
	/**
	 * Composite key name (for handling M2M table)
	 */
	protected $compositeKey = NULL;

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
	protected $enforcedPaginations = [100, 50, 25, 20, 10, 5];

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

	protected $_custom_method = NULL;
	protected $_select_query = NULL;
	protected $_look_depth = 0;
	protected $_patch_depth = '';
	protected $_id = NULL;
	protected $_method = NULL;
	protected $_action = NULL;

	public function __construct(ConnectionInterface &$db = null, ValidationInterface $validation = null)
	{
		parent::__construct($db, $validation);
		$this->afterFind[] = 'executeNestedLook';
		$this->afterFind[] = 'executeAfterFind';
		$this->beforeExecute[] = 'executeBeforeExecute';
		$this->beforeChange[] = 'executeBeforeChange';
		$this->afterChange[] = 'executeNestedUpdate';
		$this->afterChange[] = 'executeAfterChange';
		$this->beforeInsert[] = 'executeBeforeInsert';
		$this->afterInsert[] = 'executeAfterInsert';
		$this->beforeUpdate[] = 'executeBeforeUpdate';
		$this->afterUpdate[] = 'executeAfterUpdate';
		$this->beforeDelete[] = 'executeBeforeDelete';
		$this->afterDelete[] = 'executeAfterDelete';
	}

	public function setOnly($flags)
	{
		$this->only = $flags;
		return $this;
	}

	public function setWhere($flags)
	{
		$this->where = $flags;
		return $this;
	}

	public function getMetadata()
	{
		$queryCan = ['canSearch' => count($this->searchable) > 0];
		$fields = [];
		array_walk($this->allowedFields, function (&$x, $v, $f) use (&$fields) {
			$fields[$x] = (array_search($x, $f) === FALSE) ? 'text' : 'file';
		}, array_keys($this->fileUploadRules));
		return (object) [
			'name' => static::class,
			'id' => $this->_id ?? NULL,
			'query' => $this->_select_query ? array_merge($queryCan, $this->_select_query) : NULL,
			'fields' => $fields,
			'method' => $this->_method,
			'files' => $this->fileUploadRules,
		];
	}

	protected function processGetQuery($query)
	{
		// Pagination
		$page = $query['page'] ?? NULL;
		$page = intval($page) ?: NULL;
		$pageSize = $query['pageSize'] ?? NULL;
		$pageSize = intval($pageSize) ?: NULL;
		if (
			$this->enforcedPaginations !== NULL
			and !empty($this->enforcedPaginations)
		) {
			if ($page !== NULL) {
				if (array_search(
					$pageSize,
					$this->enforcedPaginations,
					TRUE
				) === NULL) {
					$pageSize = $this->enforcedPaginations[0];
				}
			} else {
				$pageSize = $this->enforcedPaginations[0];
				$page = 0;
			}
		} else if ($page !== NULL and $pageSize === NULL) {
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
		if ($orderBy) {
			if (
				is_array($this->select) and
				array_search(
					$orderBy,
					$this->select,
					TRUE
				) === FALSE
			)
				$orderBy = NULL;
			else if ($orderDirection === NULL)
				$orderDirection = 'asc';
		}
		$result['orderBy'] = $orderBy;
		$result['orderDirection'] = $orderDirection;

		// Group By
		$groupBy = $query['groupBy'] ?? NULL;
		$groupBy = $groupBy ?: NULL;
		if ($groupBy) {
			if (
				is_array($this->indexable) and
				array_search(
					$groupBy,
					$this->indexable,
					TRUE
				) === FALSE
			)
				$groupBy = NULL;
		}
		$result['groupBy'] = $groupBy;


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
			if (count($result['filters']) === 0) {
				$result['filters'] = NULL;
			}
		} else {
			$result['filters'] = NULL;
		}

		return $result;
	}

	public function translateMethod($httpVerb, $paramVerb, $id)
	{
		if ($httpVerb === GET) {
			// GET is SELECT, don't assume something else
			return SELECT;
		} else if (($httpVerb === DELETE || $paramVerb === DELETE) && $id) {
			// Sometimes it's useful to treat POST as DELETE
			return DELETE;
		} else if ($id === NULL || $paramVerb === CREATE) {
			// Sometimes it's useful to treat POST as CREATE
			return CREATE;
		} else {
			return UPDATE;
		}
	}

	/** @return CodeIgniter\HTTP\Response */
	public function execute($id = NULL)
	{
		helper('BackEnd');

		$cursor = $this->builder();
		$request = Services::request();
		$httpVerb = $request->getMethod();
		if (ENVIRONMENT === 'development') {
			$request->model = $this;
		}
		if ($id === "") {
			$id = NULL;
		}
		$paramVerb = $request->getPost('method');
		$method = $this->translateMethod($httpVerb, $paramVerb, $id);
		if (is_array($this->only) && (array_search($method, $this->only) === false)) {
			return load_405();
		}
		if (is_array($this->where)) {
			$cursor->where($this->where);
		}
		$event = $this->trigger('beforeExecute', [
			'builder' => $cursor,
			'id' => $id,
			'request' => $request,
			'method' => $method,
		]);
		$this->_method = $method;
		$this->_id = $id;
		if (isset($event['response'])) {
			return $event['response'];
		}
		if ($method === SELECT) {
			if ($id !== NULL) {
				// Specific Index
				if ($id === "0") {
					$data = get_default_values(
						$this->table,
						$this->primaryKey,
						$this->select
					);
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
			$this->_select_query = [
				'page' => $page,
				'pageSize' => $pageSize,
				'groupBy' => $groupBy,
				'orderBy' => $orderBy,
				'orderDirection' => $orderDirection,
				'search' => $search,
				'filters' => $filters,
			] = $this->processGetQuery($request->getGet());

			$cursor->select($this->select);

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
			// echo $cursor->countAllResults(); exit;
			if ($groupBy !== NULL) {
				$cursor->groupBy($groupBy);
			}
			$count = $cursor->countAllResults(false);

			if ($page !== NULL) {
				$cursor->limit($pageSize);
				$cursor->offset($pageSize * $page);
			}

			if ($orderBy !== NULL) {
				$cursor->orderBy($orderBy, $orderDirection);
			}

			$data = $this->find();
			return load_ok([
				'data' => $data,
				'page' => $page,
				'totalCount' => $count,
			]);
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
		} else {
			try {
				if ($method === CREATE) {
					$result = $this->insert($request->getPost());
				} else {
					$posts = $request->getPost();
					$this->_action = $request->getPost('action');
					$this->validationRules = array_intersect_key(
						$this->validationRules,
						$posts
					); // In update, not everything need to be validated
					$result = $this->update($id, $posts);
				}
			} catch (\Exception $th) {
				return load_error($th->getMessage());
			}
			if ($result) {
				return load_ok([
					'id' => $id ?: $result,
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
		}
		return load_405();
	}

	/** @return mixed */
	public function executeNested($flags)
	{
		extract($flags, EXTR_REFS);
		if (!$data) {
			return $data;
		}
		// In SELECT, $data is ID
		$cursor = $this->builder();
		if ($method === SELECT) {
			$this->_look_depth = $depth;
			if ($mode === 'up') {
				$cursor->select($this->select);
				return $this->find($data);
			} else if ($mode === 'down') {
				$cursor->select($this->select);
				$cursor->where($data);
				return $this->find();
			}
		} else if ($method === CREATE) {
			$this->_patch_depth = $depth;
			$this->insert(array_merge($data, $composite));
		} else if ($method === UPDATE || $method === DELETE) {
			$this->_patch_depth = $depth;
			foreach ($composite as $key => $value) {
				if ($key === $this->primaryKey) {
					$id = $value;
				} else {
					$compo = [$key => $value];
				}
			}
			$this->builder->where($compo);
			if ($method === UPDATE) {
				$this->update($id, $data);
			} else {
				$this->delete($id);
			}
		}
		return $data;
	}

	protected function executeBeforeInsert($event)
	{
		foreach ($this->fileUploadRules as $name => $attr) {
			control_file_upload($event['data'], $name, $attr, NULL);
		}
		if (is_array($this->where)) {
			foreach ($this->where as $key => $value) {
				$event['data'][$key] = $value;
			}
		}
		$event['data'] = $this->trigger('beforeChange', [
			'id' => 0,
			'data' => $event['data'],
			'existing' => NULL,
			'method' => CREATE,
			'action' => NULL,
		])['data'];
		return $event;
	}

	protected function executeBeforeUpdate($event)
	{
		$id = $event['id'];
		if (!($existing = $this->builder->get(null, 0, false)->getRow()))
			throw new ValidationException("Not Found");
		foreach ($this->fileUploadRules as $name => $attr) {
			control_file_upload($event['data'], $name, $attr, $existing);
		}
		if (is_array($this->where)) {
			foreach ($this->where as $key => $value) {
				$event['data'][$key] = $value;
			}
		}
		$event['data'] = $this->trigger('beforeChange', [
			'id' => $id,
			'data' => $event['data'],
			'existing' => $existing,
			'method' => UPDATE,
			'action' => $this->_action,
		])['data'];
		return $event;
	}

	protected function executeBeforeDelete($event)
	{
		$id = $event['id'][0];
		if (!($existing = $this->builder->get(null, 0, false)->getRow()))
			throw new ValidationException("Data Not Found");
		foreach ($this->fileUploadRules as $name => $attr) {
			if ($existing->{$name}) {
				control_file_delete($attr['folder'] ?? $name, $existing->{$name});
			}
		}
		$this->trigger('beforeChange', [
			'id' => $id,
			'data' => NULL,
			'existing' => $existing,
			'method' => DELETE,
			'action' => NULL,
		]);
		return $event;
	}


	/**
	 *  @param array $event = ['builder', 'id', 'request', 'method']
	 */
	protected function executeBeforeExecute($event)
	{
		return $event;
	}

	/**
	 * @param array $event = ['id', 'data', 'existing', 'method', 'action']
	 */
	protected function executeBeforeChange($event)
	{
		return $event;
	}

	/**
	 * @param array $event = ['id', 'data', 'method']
	 */
	protected function executeAfterChange($event)
	{
		return $event;
	}

	protected function executeAfterInsert($event)
	{
		$event['method'] = CREATE;
		$this->trigger('afterChange', $event);
		return $event;
	}

	protected function executeAfterUpdate($event)
	{
		$event['method'] = $this->_method ?? UPDATE;
		$this->trigger('afterChange', $event);
		return $event;
	}

	protected function executeAfterDelete($event)
	{
		$event['data'] = NULL;
		$event['method'] = DELETE;
		$this->trigger('afterChange', $event);
		return $event;
	}

	const DEPTH_CAP = 5;

	protected function executeNestedLook($event)
	{
		// Nested look is an expensive operation.
		// Ensure this is an individual object query.
		if ($this->_select_query) {
			return $event;
		}
		if (count($this->lookUp) > 0 && $this->_look_depth >= 0 && $this->_look_depth < BaseModel::DEPTH_CAP) {
			foreach ($this->lookUp as $key => $value) {
				if ($event['data'][$key] ?? NULL) {
					$event['data'][$key] = (new $value())->executeNested([
						'mode' => 'up',
						'data' => $event['data'][$key],
						'method' => GET,
						'depth' => $this->_look_depth + 1
					]);
				}
			}
		}
		if (count($this->lookDown) > 0 && $this->_look_depth <= 0 && $this->_look_depth > -BaseModel::DEPTH_CAP) {
			foreach ($this->lookDown as $key => $value) {
				$model = new $value();
				if (isset($event['id'])) {
					if ($model->compositeKey) {
						$event['data'][$key] = array_map(function ($v) use ($model) {
							$v[$model->compositeKey] = $v[$model->compositeKey][0];
							return $v;
						}, $model->executeNested([
							'mode' => 'down',
							'data' => [$model->primaryKey => $event['id']],
							'method' => SELECT,
							'depth' => $this->_look_depth - 1
						]));
						if ($model->compositeWrap ?? FALSE) {
							foreach ($event['data'][$key] as $k => $v) {
								$event['data'][$key][$k] =
									$v[$model->compositeKey];
							}
						}
					} else {
						$event['data'][$key] = $model->executeNested([
							'mode' => 'down',
							'data' => [$key => $event['id']],
							'method' => SELECT,
							'depth' => $this->_look_depth - 1
						]);
					}
				} else {
					foreach ($event['data'] as &$value) {
						$value[$this->compositeKey ?: $key] = $model->executeNested([
							'mode' => 'down',
							'data' => [$key => $value[$this->compositeKey ?: $this->primaryKey]],
							'method' => SELECT,
							'depth' => $this->_look_depth - 1
						]);
					}
				}
			}
		}
		return $event;
	}

	protected function executeNestedUpdate($event)
	{
		if ($event['method'] === DELETE) {
			// DELETE nested should been automagically handled by RI
			return $event;
		}
		$request = Services::request();
		foreach ($this->lookDown as $key => $value) {
			$model = new $value();
			if (count($model->allowedFields) > 0) {
				$param = $this->_patch_depth ? $this->_patch_depth . '[' . $key . ']' : $key;
				/** @var mixed[] multi-valued array (the key is ID of composite/primaryKey) */
				$data = $request->getPost($param);
				if (is_array($data)) {
					foreach ($data as $dk => $dv) {
						$model->executeNested([
							'mode' => 'down',
							'data' => $dv,
							// This composite combined with data on CREATE
							// This composite used as WHERE flag on UPDATE
							'composite' => $model->compositeKey ? [
								$model->compositeKey => $dk,
								$this->primaryKey => $event['id'],
							] : [
								$model->primaryKey => $dk,
								$key => $event['id'],
							],
							'method' => $dv['method'] ?? $event['method'],
							'depth' => $param,
						]);
					}
				}
			}
		}
	}

	protected function executeAfterFind($event)
	{
		return $event;
	}
}
